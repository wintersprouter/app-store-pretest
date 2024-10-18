import { makeApi, Zodios } from "@zodios/core";
import { z } from "zod";
import mapError from "../mapError";

const appNameSchema = z.object({
  label: z.string(),
});

export type APP_NAME = z.infer<typeof appNameSchema>;

const appImageSchema = z.object({
  label: z.string().url(),
  attributes: z.object({
    height: z.string(),
  }),
});

export type APP = z.infer<typeof appSchema>;

const appIdSchema = z.object({
  label: z.string().url(),
  attributes: z.object({
    "im:id": z.string(),
    "im:bundleId": z.string(),
  }),
});

export type APP_ID = z.infer<typeof appIdSchema>;
export const appSchema = z.object({
  "im:name": appNameSchema,
  "im:image": z.array(appImageSchema),
  summary: z.object({
    label: z.string(),
  }),
  "im:price": z.object({
    label: z.string(),
    attributes: z.object({
      amount: z.string(),
      currency: z.string(),
    }),
  }),
  "im:contentType": z.object({
    attributes: z.object({
      term: z.string(),
      label: z.string(),
    }),
  }),
  rights: z.object({
    label: z.string(),
  }),
  title: z.object({
    label: z.string(),
  }),
  link: z.union([
    z.array(
      z.object({
        attributes: z.object({
          rel: z.string(),
          type: z.string().optional(),
          href: z.string().url(),
        }),
      }),
    ),
    z.object({
      attributes: z.object({
        rel: z.string(),
        type: z.string().optional(),
        href: z.string().url(),
      }),
    }),
  ]),
  id: appIdSchema,
  "im:artist": z.object({
    label: z.string(),
    attributes: z.object({
      href: z.string().url(),
    }),
  }),
  category: z.object({
    attributes: z.object({
      "im:id": z.string(),
      term: z.string(),
      scheme: z.string(),
      label: z.string(),
    }),
  }),
  "im:releaseDate": z.object({
    label: z.string(),
    attributes: z.object({
      label: z.string(),
    }),
  }),
});

const linkSchema = z.object({
  attributes: z.object({
    rel: z.string(),
    type: z.string().optional(),
    href: z.string().url(),
  }),
});

export const applicationsSchema = z.object({
  feed: z.object({
    entry: z.array(appSchema),
    link: z.array(linkSchema),
    id: z.object({
      label: z.string().url(),
    }),
    icon: z.object({
      label: z.string().url(),
    }),
    title: z.object({
      label: z.string(),
    }),
    rights: z.object({
      label: z.string(),
    }),
    updated: z.object({
      label: z.string(),
    }),
    author: z.object({
      name: z.object({
        label: z.string(),
      }),
      uri: z.object({
        label: z.string().url(),
      }),
    }),
  }),
});

export const topFreeApplicationsSchema = applicationsSchema;

const resultSchema = z.object({
  screenshotUrls: z.array(z.string().url()),
  ipadScreenshotUrls: z.array(z.string().url()),
  appletvScreenshotUrls: z.array(z.string().url()),
  artworkUrl60: z.string().url(),
  artworkUrl512: z.string().url(),
  artworkUrl100: z.string().url(),
  artistViewUrl: z.string().url(),
  features: z.array(z.string()),
  supportedDevices: z.array(z.string()),
  advisories: z.array(z.string()),
  isGameCenterEnabled: z.boolean(),
  kind: z.string(),
  formattedPrice: z.string(),
  contentAdvisoryRating: z.string(),
  userRatingCountForCurrentVersion: z.number(),
  trackViewUrl: z.string().url(),
  trackContentRating: z.string(),
  fileSizeBytes: z.string(),
  averageUserRatingForCurrentVersion: z.number(),
  averageUserRating: z.number(),
  trackCensoredName: z.string(),
  languageCodesISO2A: z.array(z.string()),
  bundleId: z.string(),
  trackId: z.number(),
  trackName: z.string(),
  releaseDate: z.string(),
  currentVersionReleaseDate: z.string(),
  genreIds: z.array(z.string()),
  primaryGenreName: z.string(),
  primaryGenreId: z.number(),
  isVppDeviceBasedLicensingEnabled: z.boolean(),
  sellerName: z.string(),
  releaseNotes: z.string(),
  version: z.string(),
  wrapperType: z.string(),
  currency: z.string(),
  description: z.string(),
  minimumOsVersion: z.string(),
  artistId: z.number(),
  artistName: z.string(),
  genres: z.array(z.string()),
  price: z.number(),
  userRatingCount: z.number(),
});
export type Result = z.infer<typeof resultSchema>;
export const lookupSchema = z.object({
  resultCount: z.number(),
  results: z.array(resultSchema),
});

const topGrossingApplicationsSchema = applicationsSchema;

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
  const response = await apiClient.get("/tw/lookup", {
    queries: {
      id,
    },
  });
  lookupSchema.parse(response);
  return response.results;
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
};
