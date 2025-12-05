import { Router } from "express";

import { 
  changeConfiguration, 
  getConfiguration, 
  reset
} from "./actions.controller";

const actionsRouter = Router();

actionsRouter.post(
  "/:identity/get-configuration", 
  getConfiguration
);

actionsRouter.post(
  "/:identity/change-configuration", 
  changeConfiguration
);

actionsRouter.post(
  "/:identity/reset", 
  reset
);

export { actionsRouter };
