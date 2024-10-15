import { makeApi, Zodios } from "@zodios/core";
import { z } from "zod";

const appSchema = z.object({
  "im:name": z.object({
    label: z.string(),
  }),
  "im:image": z.array(
    z.object({
      label: z.string().url(),
      attributes: z.object({
        height: z.string(),
      }),
    }),
  ),
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
  id: z.object({
    label: z.string().url(),
    attributes: z.object({
      "im:id": z.string(),
      "im:bundleId": z.string(),
    }),
  }),
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

const applicationsSchema = z.object({
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

const topFreeApplicationsSchema = applicationsSchema;

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

const lookupSchema = z.object({
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

const zodios = new Zodios("https://itunes.apple.com", api);

async function getTopFreeApplications() {
  const response = await zodios.getTopFreeApplications();
  console.log("response", response);
  topFreeApplicationsSchema.parse(response);
  return response;
}
export { getTopFreeApplications, zodios };
