import express from 'express';
import supertest, { Response } from 'supertest';
import { Readable } from 'stream';
import { errorHandler } from '../../util/express';
import { torrentProxyApiRouter } from './router';
import { EncodingOption } from 'fs';

describe(`torrent proxy router`, () => {

  const createStream = jest.fn();
  const queryStream = jest.fn();
  
  const server = express()
    .use(torrentProxyApiRouter(createStream, queryStream, []))
    .use(errorHandler)
    .listen(9001);

  beforeEach(() => jest.resetAllMocks());

  afterAll(() => server.close());

  const givenReadableStream = (raw: string, encoding: BufferEncoding) => {
    const stream = new Readable();
    stream._read = () => {};
    stream.push(raw, encoding);
    stream.push(null, encoding);
    return stream;
  };

  const responseBufferParser = (encoding: BufferEncoding) => {
    let buffer = '';
    return (response: Response, done: (err: Error | null, body: any) => void) => {
      response.setEncoding(encoding);
      response.on(`data`, chunk => { buffer += chunk; });
      response.on(`end`, () => done(null, Buffer.from(buffer, encoding)));
    };
  };

  describe(`post stream`, () => {
    test(`given invalid request > when post > should return 400 with errors`, async () => {
      await supertest(server)
        .post(`/stream`)
        .set(`Content-Type`, `application/json`)
        .send({ magnet: 123 })
        .expect(400)
        .then(response => {
          expect(response.body).toEqual({
            message: `Invalid Request`,
            errors: [`body.magnet is not a valid string`],
          });
          expect(createStream).not.toHaveBeenCalled();
        });
    });

    test(`given valid request > when post > should return 200 with stream id`, async () => {
      createStream.mockResolvedValue({ streamId: `stream-123` });

      await supertest(server)
        .post(`/stream`)
        .set(`Content-Type`, `application/json`)
        .send({ magnet: `magnet-123` })
        .expect(200)
        .then(response => {
          expect(response.body).toEqual({ streamId: `stream-123` });
          expect(createStream).toHaveBeenCalledWith(`magnet-123`);
        });
    });
  });

  describe(`get stream`, () => {
    test(`given no range header > when get > should return 400 with errors`, async () => {
      await supertest(server)
        .get(`/stream/stream-123`)
        .send()
        .expect(400)
        .then(response => {
          expect(response.body).toEqual({
            message: `Range header is required`,
          });
        });
    });

    test(`given stream does not exist > when get > should return 404`, async () => {
      queryStream.mockResolvedValue(undefined);

      await supertest(server)
        .get(`/stream/stream-123`)
        .set(`Range`, `bytes=0-`)
        .send()
        .expect(404);
    });

    // FIXME: supertest reports socket hang up
    test.skip(`given stream exists > when get > should return 206 with correct headers and video stream data`, async () => {
      const stream = givenReadableStream(`1234567890`, 'utf8');
      const start = 0;
      const end = 60;
      const type = `video/mp4`;
      const length = 10;
      queryStream.mockResolvedValue({ length, type, read: () => stream.read() });

      const response = await supertest(server)
        .get(`/stream/stream-123`)
        .set(`Range`, `bytes=${start}-${end}`)
        .set(`Accept`, `video/mp4`)
        .buffer()
        .parse(responseBufferParser('utf8')); // parser is never called

      expect(response.status).toBe(206);
      expect(response.get(`Content-Range`)).toBe(``);
      expect(response.get(`Accept-Ranges`)).toBe(`bytes`);
      expect(response.get(`Content-Length`)).toBe(end - start + 1);
      expect(response.get(`Content-Type`)).toBe(`video/mp4`);
    
      expect(response.body).toEqual(`1234567890`);
    });
  });
});
