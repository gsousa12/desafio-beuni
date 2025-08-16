import { BirthdayEmployee } from "./entities";

export type BirthdayCheckJobData = {
  type: "birthday-check";
  scheduledAt: string;
};

export type BirthdayProcessJobData = {
  type: "birthday-process";
  data: BirthdayEmployee;
};

export type BirthdayJobData = {
  type: "birthday-gift";
  data: BirthdayEmployee;
  scheduledAt: string;
};
