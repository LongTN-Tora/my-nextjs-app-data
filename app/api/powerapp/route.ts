import { NextRequest, NextResponse } from 'next/server';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

function getFlowConfig() {
  const flowUrl = process.env.POWERAPP_FLOW_URL;
  const flowKey = process.env.POWERAPP_FLOW_KEY; // optional (nếu Flow dùng query key hoặc header riêng)
  // Power Automate HTTP trigger thường trả key ở query param `sig` (hoặc đôi khi `code`).
  // Cho phép cấu hình tên param để append key.
  const flowKeyParam = process.env.POWERAPP_FLOW_KEY_PARAM || 'sig';
  return { flowUrl, flowKey, flowKeyParam };
}

async function callFlow(opts: {
  method: 'GET' | 'POST';
  url: string;
  key?: string;
  keyParam?: string;
  query?: URLSearchParams;
  jsonBody?: unknown;
}) {
  const target = new URL(opts.url);

  // Merge query: incoming -> flow
  if (opts.query) {
    opts.query.forEach((value, name) => target.searchParams.set(name, value));
  }

  // Nếu Flow URL không chứa key sẵn, cho phép append key qua env
  if (opts.key && !target.searchParams.has('code') && !target.searchParams.has('sig')) {
    const param = opts.keyParam || 'sig';
    target.searchParams.set(param, opts.key);
  }

  const res = await fetch(target.toString(), {
    method: opts.method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: opts.method === 'POST' ? JSON.stringify(opts.jsonBody ?? {}) : undefined,
    // tránh cache khi gọi Flow
    cache: 'no-store',
  });

  const text = await res.text();
  let data: unknown = text;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // keep as string if not JSON
  }

  return { ok: res.ok, status: res.status, data };
}

function normalizeFlowPayload(payload: unknown) {
  // Power Automate "List rows" thường trả: { value: [...] }
  // hoặc Flow tự build response khác. Ta cố normalize về { items: [...] } nếu có thể.
  if (payload && typeof payload === 'object') {
    const maybeObj = payload as Record<string, unknown>;
    if (Array.isArray(maybeObj.value)) {
      return { items: maybeObj.value, raw: payload };
    }
    if (Array.isArray(maybeObj.items)) {
      return { items: maybeObj.items, raw: payload };
    }
  }
  return { items: payload, raw: payload };
}

// GET endpoint - Hệ thống gọi vào đây để lấy data từ Power Automate Flow
export async function GET(request: NextRequest) {
  try {
    const { flowUrl, flowKey, flowKeyParam } = getFlowConfig();
    if (!flowUrl) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing configuration',
          message: 'POWERAPP_FLOW_URL is not set.',
        },
        { status: 500, headers: corsHeaders() }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const flowRes = await callFlow({
      // Power Automate HTTP trigger URL thường là "HTTP POST URL"
      // nên dù client gọi GET vào API này, ta vẫn gọi Flow bằng POST.
      method: 'POST',
      url: flowUrl,
      key: flowKey,
      keyParam: flowKeyParam,
      query: searchParams,
      jsonBody: {}, // keep Flow trigger happy; Flow có thể ignore body nếu không dùng
    });

    if (!flowRes.ok) {
      return NextResponse.json(
        {
          success: false,
          error: 'Flow request failed',
          status: flowRes.status,
          flowResponse: flowRes.data,
        },
        { status: 502, headers: corsHeaders() }
      );
    }

    const normalized = normalizeFlowPayload(flowRes.data);

    return NextResponse.json(
      {
        success: true,
        data: normalized.items,
        raw: normalized.raw,
        timestamp: new Date().toISOString(),
      },
      { status: 200, headers: corsHeaders() }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      {
        status: 500,
        headers: {
          ...corsHeaders(),
        },
      }
    );
  }
}

// POST endpoint - forward body sang Flow (nếu bạn muốn Flow xử lý/ghi dữ liệu)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { flowUrl, flowKey, flowKeyParam } = getFlowConfig();
    if (!flowUrl) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing configuration',
          message: 'POWERAPP_FLOW_URL is not set.',
        },
        { status: 500, headers: corsHeaders() }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const flowRes = await callFlow({
      method: 'POST',
      url: flowUrl,
      key: flowKey,
      keyParam: flowKeyParam,
      query: searchParams,
      jsonBody: body,
    });

    if (!flowRes.ok) {
      return NextResponse.json(
        {
          success: false,
          error: 'Flow request failed',
          status: flowRes.status,
          flowResponse: flowRes.data,
        },
        { status: 502, headers: corsHeaders() }
      );
    }

    const normalized = normalizeFlowPayload(flowRes.data);

    return NextResponse.json(
      {
        success: true,
        data: normalized.items,
        raw: normalized.raw,
        timestamp: new Date().toISOString(),
      },
      { status: 200, headers: corsHeaders() }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid request',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      {
        status: 400,
        headers: {
          ...corsHeaders(),
        },
      }
    );
  }
}

// OPTIONS endpoint - Cần cho CORS preflight requests
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        ...corsHeaders(),
      },
    }
  );
}

