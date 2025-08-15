import { BirthdayEmployee } from "./entities";

export type BirthdayCheckJobData = {
  type: "birthday-check";
  scheduledAt: string;
};

export type BirthdayProcessJobData = {
  type: "birthday-process";
  employee: BirthdayEmployee;
};

export interface BirthdayJobData {
  type: "birthday-gift";
  employee: BirthdayEmployee;
  scheduledAt: string;
}
