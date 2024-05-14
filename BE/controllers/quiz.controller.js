import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import dotenv from "dotenv";

import { Types } from "mongoose";
import fs from "fs";



dotenv.config();

// Access your API key as an en vironment variable (see "Set up your API key" above)

const quiz = {
  name: "quiz1",
  timePerQuest: 10,
  question: [
    {
      content: "What is the capital of France?",
      answer: [
        {
          content: "Paris",
          score: 1,
        },
        {
          content: "London",
          score: 0,
        },
        {
          content: "Berlin",
          score: 0,
        },
        {
          content: "Madrid",
          score: 0,
        },
      ],
    },
    {
      content: "What is the capital of Germany?",
      answer: [
        {
          content: "Paris",
          score: 0,
        },
        {
          content: "London",
          score: 0,
        },
        {
          content: "Berlin",
          score: 1,
        },
        {
          content: "Madrid",
          score: 0,
        },
      ],
    },
    {
      content: "What is the capital of Spain?",
      answer: [
        {
          content: "Paris",
          score: 0,
        },
        {
          content: "London",
          score: 0,
        },
        {
          content: "Berlin",
          score: 0,
        },
        {
          content: "Madrid",
          score: 1,
        },
      ],
    },
  ],
};

export const startQuiz = async (req, res) => {
  try {
    // Start quiz real-time with socket.io

    

  } catch (error) {
    console.log("Error catch in startQuiz: ", error);
  }
};

export const joinQuiz = async (req, res) => {
  try {


  } catch (error) {
    console.log("Error catch in joinQuiz: ", error);
  }
};

export const submitAnswer = async (req, res) => {
  try {
  } catch (error) {
    console.log("Error catch in submitAnswer: ", error);
  }
};
