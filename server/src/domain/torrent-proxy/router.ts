import { json, Request, Response, Router } from 'express'
import { accessSync } from 'fs';
import { ValidationError } from '../../util/errors';
import { asyncRoute } from '../../util/express'
import { isValidString } from '../../util/validation';
import { ProxiedVideoStreamCreateCommandHandler } from './create-handler';
import { ProxiedVideoStreamQueryHandler } from './query-handler';

export const torrentProxyApiRouter = (
  createStream: ProxiedVideoStreamCreateCommandHandler,
  queryStream: ProxiedVideoStreamQueryHandler,
  addonUrls: string[],
) => {

  const postStreamRoute = async (request: Request, response: Response) => {
    validateStreamRequestBody(request.body);
    const { magnet } = request.body;
    const { streamId } = await createStream(magnet);
    return response.status(200).send({ streamId });
  };

  const getStreamRoute = async (request: Request, response: Response) => {
    const range = request.headers.range;
    if (!range) return response.status(400).json({ message: 'Range header is required' });
    
    const { streamId } = request.params;
    const stream = await queryStream(streamId);
    if (!stream) return response.sendStatus(404);
    const { start, end } = parseRange(range, stream.length);

    response.writeHead(206, {
      'Content-Range': formatContentRange(start, end, stream.length),
      'Accept-Ranges': `bytes`,
      'Content-Length': end - start + 1,
      'Content-Type': stream.type,
    });

    return stream
      .read(start, end)
      .pipe(response);
  }

  const getAddonUrlsRoute = (request: Request, response: Response) => response.status(200).json({ addonUrls });

  const postKillRoute = (request: Request, response: Response) => {
    setTimeout(() => process.exit(1), 50);
    return response.sendStatus(200);
  }

  return Router()
    .use(json())
    .get(`/addons`, getAddonUrlsRoute)
    .post(`/kill`, postKillRoute)
    .post(`/stream`, asyncRoute(postStreamRoute))
    .get(`/stream/:streamId`, asyncRoute(getStreamRoute));
};

const validateStreamRequestBody: (body: any) => asserts body is { magnet: string } = body => {
  const errors: string[] = [];
  if (!isValidString(body?.magnet)) errors.push(`body.magnet is not a valid string`);
  if (errors.length > 0) throw new ValidationError(errors);
}

const parseRange = (range: string, contentLength: number) => {
  const chunkSize = 10 ** 6; // 1MB
  const start = Number(range.replace(/\D/g, ``));
  const end = Math.min(start + chunkSize, contentLength - 1);
  return { start, end };
}

const formatContentRange = (start: number, end: number, length: number) => `bytes ${start}-${end}/${length}`
