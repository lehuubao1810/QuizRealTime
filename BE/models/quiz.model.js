import mongoose from "mongoose";

const COLLECTION_NAME = "quizs";

const characterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  timePerQuest: {
    type: Number,
    required: true,
  },
  question: {
    type: {
      content: {
        type: String,
        required: true,
      },
      answer: {
        type: [
          {
            content: {
              type: String,
              required: true,
            },
            score: {
              type: 0 | 1,
              required: true,
            }
          },
        ],
        required: true,
      },
    },
    required: true,
  },
});

const Quiz = mongoose.model("quiz", characterSchema, COLLECTION_NAME);
export default Quiz;
