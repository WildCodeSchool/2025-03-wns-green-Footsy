import Activity from "../entities/Activity";
import { Between } from "typeorm";

export class ActivityService {
  private get activityRepository() {
    return Activity.getRepository();
  }

  get findAllByUserId() {
    return async (userId: number): Promise<Activity[]> => {
      return this.activityRepository.find({ where: { user: { id: userId } } });
    };
  }

  get findActivitiesByUserIdAndYear() {
    return async (userId: number, year: number): Promise<Activity[]> => {
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;

      return this.activityRepository.find({
        where: {
          user: { id: userId },
          date: Between(
            startDate as unknown as Date,
            endDate as unknown as Date,
          ),
        },
        relations: ["type", "type.category"],
        order: { date: "ASC" },
      });
    };
  }

  get findActivitiesByUserIdAndCategory() {
    return async (userId: number, categoryId: number): Promise<Activity[]> => {
      return this.activityRepository.find({
        where: {
          user: { id: userId },
          type: { category: { id: categoryId } },
        },
        relations: ["type", "type.category"],
        order: { date: "ASC" },
      });
    };
  }

  get findAll() {
    return async (): Promise<Activity[]> => {
      return this.activityRepository.find();
    };
  }

  get createActivity() {
    return async (activityData: Partial<Activity>): Promise<Activity> => {
      const activity = this.activityRepository.create(activityData);
      return activity.save();
    };
  }

  get updateActivity() {
    return async (
      id: number,
      updateData: Partial<Activity>,
    ): Promise<Activity | null> => {
      const activity = await this.activityRepository.findOne({ where: { id } });
      if (!activity) {
        return null;
      }
      Object.assign(activity, updateData);
      return activity.save();
    };
  }

  get deleteActivity() {
    return async (id: number): Promise<boolean> => {
      const result = await this.activityRepository.delete(id);
      return result.affected !== 0;
    };
  }
}
