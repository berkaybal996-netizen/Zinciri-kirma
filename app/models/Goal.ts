import mongoose, { Schema, models, model } from "mongoose"

const GoalSchema = new Schema(
  {
    username: String,
    goal: String,
    month: String,
    year: String,
  },
  { timestamps: true }
)

const Goal = models.Goal || model("Goal", GoalSchema)

export default Goal
