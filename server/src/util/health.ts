import { Request, Response, Router } from 'express';
import { Logger } from 'winston';
import { asyncRoute } from './express';

export const healthRouter = () => {

  const getHealthRoute = async (request: Request, response: Response) =>
    response.status(200).send();

  const getStatusRoute = async (request: Request, response: Response) =>
    response.status(200).send();

  return Router()
    .get(`/health`, asyncRoute(getHealthRoute))
    .get(`/status`, asyncRoute(getStatusRoute));
};
