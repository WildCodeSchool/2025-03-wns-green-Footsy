import Activity from "../entities/Activity";

export class ActivityService {
  private get activityRepository() {
    return Activity.getRepository();
  }

  get findAllByUserId() {
    return async (userId: number): Promise<Activity[]> => {
      return this.activityRepository.find({ where: { user: { id: userId } } });
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
      updateData: Partial<Activity>
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