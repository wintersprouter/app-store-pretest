import { makeApi, Zodios } from "@zodios/core";
import axios from "axios";
import { z } from "zod";
import mapError from "../mapError";
import {
  lookupSchema,
  topFreeApplicationsSchema,
  topGrossingApplicationsSchema,
} from "./types";

const api = makeApi([
  {
    method: "get",
    path: "/tw/rss/topfreeapplications/limit=100/json",
    alias: "getTopFreeApplications",
    description: "Get the top 100 free applications in Taiwan",
    response: topFreeApplicationsSchema,
  },
  {
    method: "get",
    path: "/tw/lookup",
    alias: "lookupApp",
    parameters: [
      {
        name: "id",
        type: "Query",
        schema: z.string(),
      },
    ],
    description: "Lookup an application by its ID",
    response: lookupSchema,
  },
  {
    method: "get",
    path: "/tw/rss/topgrossingapplications/limit=10/json",
    alias: "getTopGrossingApplications",
    description: "Get the top 10 grossing applications in Taiwan",
    response: topGrossingApplicationsSchema,
  },
]);
const apiClient = new Zodios("https://itunes.apple.com", api);

apiClient.axios.interceptors.response.use(
  (response) => {
    console.log("response", response);
    return response;
  },
  (error: unknown) => {
    console.error("error", error);
    return Promise.reject(new Error(mapError(error)));
  },
);

async function getTopFreeApplications() {
  const response = await apiClient.get(
    "/tw/rss/topfreeapplications/limit=100/json",
  );
  topFreeApplicationsSchema.parse(response);
  return response.feed.entry;
}

async function getAppDetails(id: string) {
  try {
    const response = await axios.get<Promise<z.infer<typeof lookupSchema>>>(
      `/api/lookup?ids=${id}`,
    );
    lookupSchema.parse(response.data);
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

async function getTopGrossingApplications() {
  const response = await apiClient.get(
    "/tw/rss/topgrossingapplications/limit=10/json",
  );
  topGrossingApplicationsSchema.parse(response);
  return response.feed.entry;
}

export {
  apiClient,
  getAppDetails,
  getTopFreeApplications,
  getTopGrossingApplications,
  lookupSchema,
};
