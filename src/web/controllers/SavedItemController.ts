import { User } from "./../../data/entities/User";
import { SavedItemType } from "./../../data/entities/SavedItemType";
import { SavedItem } from "./../../data/entities/SavedItem";
import { createLogger } from "../../monitor/logger";
import { Request, Response } from "express";
import { AppErrorCode } from "../../service/errors/AppErrorCode";
import { AppError } from "../../service/errors/AppError";
import { SavedItemService } from "../../service/services/SavedItemService";

const LOGGER = createLogger(__filename);

export class SavedItemController {
  private savedItemService: SavedItemService;

  constructor(savedItemService: SavedItemService) {
    this.savedItemService = savedItemService;
  }

  getAll = async (_: Request, res: Response): Promise<Response> => {
    LOGGER.debug("Function call: getAll");

    try {
      const savedItems = await this.savedItemService.getAllSavedItems();
      return res.status(200).json(savedItems);
    } catch (e: any) {
      LOGGER.error(e.stack);
      if (e instanceof AppError) {
        switch (e.code) {
          case AppErrorCode.SYS02.code:
            return res.status(500).json(e.getSummary());
        }
      }
      return res.status(500).json(new AppError(AppErrorCode.SYS01));
    }
  };

  getAllByUserId = async (req: Request, res: Response): Promise<Response> => {
    LOGGER.debug("Function call: getAllByUserId with id = " + req.params.id);
    try {
      const savedItems = await this.savedItemService.getAllSavedItemByUser(
        Number(req.params.id)
      );
      return res.status(200).json(savedItems);
    } catch (e: any) {
      LOGGER.error(e.stack);
      if (e instanceof AppError) {
        switch (e.code) {
          case AppErrorCode.SYS02.code:
            return res.status(500).json(e.getSummary());
        }
      }
      return res.status(500).json(new AppError(AppErrorCode.SYS01));
    }
  };

  getAllByType = async (req: Request, res: Response): Promise<Response> => {
    LOGGER.debug(
      "Function call: getAllByUserIdAndType with resource type " +
        req.params.type
    );
    const securityContext = res.locals.user;
    const user = Object.assign(new User(), securityContext.user);
    try {
      const savedItems =
        await this.savedItemService.getAllSavedItemByUserAndType(
          user.id,
          req.params.type
        );
      return res.status(200).json(savedItems);
    } catch (e: any) {
      LOGGER.error(e.stack);
      if (e instanceof AppError) {
        switch (e.code) {
          case AppErrorCode.SYS02.code:
            return res.status(500).json(e.getSummary());
        }
      }
      return res.status(500).json(new AppError(AppErrorCode.SYS01));
    }
  };

  createSavedItem = async (req: Request, res: Response): Promise<Response> => {
    LOGGER.debug("Function call: createSavedItem");
    const securityContext = res.locals.user;
    const providedItem: SavedItem = Object.assign(new SavedItem(), req.body);
    //Set the current auth user
    providedItem.user = Object.assign(new User(), securityContext.user);
    providedItem.savedItemType = Object.assign(
      new SavedItemType(),
      req.body.type
    );
    try {
      const savedItem = await this.savedItemService.createSavedItem(
        providedItem
      );
      return res.status(201).json(savedItem);
    } catch (e: any) {
      LOGGER.error(e.stack);
      if (e instanceof AppError) {
        switch (e.code) {
          case AppErrorCode.SYS02.code:
            return res.status(500).json(e.getSummary());
        }
      }
      return res.status(500).json(new AppError(AppErrorCode.SYS01));
    }
  };

  deleteSavedItem = async (req: Request, res: Response): Promise<Response> => {
    LOGGER.debug("Function call: deleteSavedItem with id " + req.params.id);
    try {
      const deletedItem = await this.savedItemService.deleteSavedItem(
        Number(req.params.id)
      );
      return res.status(200).json(deletedItem);
    } catch (e: any) {
      LOGGER.error(e.stack);
      if (e instanceof AppError) {
        switch (e.code) {
          case AppErrorCode.SYS02.code:
            return res.status(500).json(e.getSummary());
        }
      }
      return res.status(500).json(new AppError(AppErrorCode.SYS01));
    }
  };

  updateSavedItem = async (req: Request, res: Response): Promise<Response> => {
    LOGGER.debug(
      "Function call: updateSavedItem with id " +
        req.params.id +
        " and rating " +
        req.body.rating
    );
    try {
      const updatedItem = await this.savedItemService.updateSavedItem(
        Number(req.params.id),
        Number(req.body.rating)
      );
      return res.status(200).json(updatedItem);
    } catch (e: any) {
      LOGGER.error(e.stack);
      if (e instanceof AppError) {
        switch (e.code) {
          case AppErrorCode.SYS02.code:
            return res.status(500).json(e.getSummary());
        }
      }
      return res.status(500).json(new AppError(AppErrorCode.SYS01));
    }
  };

  findItemInUserSavedItems = async (req: Request, res: Response): Promise<Response> => {
    LOGGER.debug(
      "Function call: findItemInUserSavedItems with id " +
        req.params.jikanId
    );
    //Get Auth user
    const authUser = Object.assign(new User(), res.locals.user);
    try {
      const savedItem = await this.savedItemService.findSavedItemByJikanId(
        Number(req.params.jikanId),
        authUser.user
      );
      return res.status(200).json(savedItem);
    } catch (e: any) {
      LOGGER.error(e.stack);
      if (e instanceof AppError) {
        switch (e.code) {
          case AppErrorCode.SER02.code:
            return res.status(500).json(e.getSummary());
        }
      }
      return res.status(500).json(new AppError(AppErrorCode.SYS01));
    }
  };
}
