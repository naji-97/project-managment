import { NextRequest } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!; // e.g. https://project-managment-oqvb.onrender.com

export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const url = `${API_BASE_URL}/api/auth/${path.join("/")}`;
  return fetch(url, {
    method: "GET",
    headers: req.headers,
    credentials: "include",
  });
}


export async function POST(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const url = `${API_BASE_URL}/api/auth/${path.join("/")}`;
  const body = await req.text();
  return fetch(url, {
    method: "POST",
    headers: req.headers,
    credentials: "include",
    body,
  });
}

