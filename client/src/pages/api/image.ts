import type { NextApiRequest, NextApiResponse } from "next";

import { AWSStorage } from "@/lib/storage/AwsStorage";
import { checkQueryParams, getQueryParams } from "@/lib/params";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req;

  if (!checkQueryParams(query)) {
    res.status(500).send("Incorrect params");
    return;
  }

  return handle(res, new AWSStorage(), getQueryParams(query));
}
