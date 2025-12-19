import { NextRequest, NextResponse } from "next/server";

// API: POST /api/register
// Body expected by Flow (HTTP request trigger):
// {
//   "CustomerName": "string",
//   "ProjectName": "string",
//   "Requester": "string",
//   "CustomerEmail": "string",
//   "WorkType": "string",
//   "Quantity": number,
//   "Unit": "string",
//   "UnitPrice": number,
//   "Subtotal": number,
//   "Tax": number
// }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      CustomerName,
      ProjectName,
      Requester,
      CustomerEmail,
      WorkType,
      Quantity,
      Unit,
      UnitPrice,
      Subtotal,
      Tax,
    } = body as {
      CustomerName?: string;
      ProjectName?: string;
      Requester?: string;
      CustomerEmail?: string;
      WorkType?: string;
      Quantity?: number;
      Unit?: string;
      UnitPrice?: number;
      Subtotal?: number;
      Tax?: number;
    };

    if (!CustomerName || !ProjectName) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          message: "CustomerName và ProjectName là bắt buộc",
        },
        { status: 400 }
      );
    }

    // Nên đưa URL này vào biến môi trường, nhưng để đơn giản giữ nguyên như bạn đang dùng
    const flowUrl =
      process.env.POWERAPP_REGISTER_FLOW_URL ??
      "https://2cbaa891d220ed2a81dd0de71ec0b6.b0.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/1de9cb35d9eb432397e37c4b1c72ff54/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=b1ESCKEjnrIiyrK1iaYDEvOMxixwe-tn9tT2zhKpB7U";

    const flowRes = await fetch(flowUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        CustomerName,
        ProjectName,
        Requester,
        CustomerEmail,
        WorkType,
        Quantity,
        Unit,
        UnitPrice,
        Subtotal,
        Tax,
      }),
      cache: "no-store",
    });

    const flowData = await flowRes
      .json()
      .catch(() => null as unknown | null);

    if (!flowRes.ok) {
      return NextResponse.json(
        {
          success: false,
          error: "Flow call failed",
          status: flowRes.status,
          flowResponse: flowData,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Data successfully added to Estimates.",
        flowResponse: flowData,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}


