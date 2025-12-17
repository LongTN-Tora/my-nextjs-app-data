import { NextRequest, NextResponse } from 'next/server';

// GET endpoint - Power Apps có thể gọi để lấy data
export async function GET(request: NextRequest) {
  try {
    // Lấy query parameters nếu có
    const searchParams = request.nextUrl.searchParams;
    const filter = searchParams.get('filter');
    const limit = searchParams.get('limit');

    // Dữ liệu mẫu (có thể thay thế bằng database hoặc external API)
    let data = [
      {
        id: 1,
        name: 'Product A',
        category: 'Electronics',
        price: 299.99,
        stock: 50,
        createdAt: '2024-01-15',
      },
      {
        id: 2,
        name: 'Product B',
        category: 'Clothing',
        price: 49.99,
        stock: 100,
        createdAt: '2024-01-20',
      },
      {
        id: 3,
        name: 'Product C',
        category: 'Electronics',
        price: 599.99,
        stock: 25,
        createdAt: '2024-02-01',
      },
    ];

    // Áp dụng filter nếu có
    if (filter) {
      data = data.filter((item) =>
        item.name.toLowerCase().includes(filter.toLowerCase()) ||
        item.category.toLowerCase().includes(filter.toLowerCase())
      );
    }

    // Áp dụng limit nếu có
    if (limit) {
      data = data.slice(0, parseInt(limit));
    }

    // Trả về response với CORS headers để Power Apps có thể gọi
    return NextResponse.json(
      {
        success: true,
        data: data,
        count: data.length,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
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
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

// POST endpoint - Power Apps có thể gửi data lên
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Xử lý data từ Power Apps
    // Ví dụ: lưu vào database, xử lý logic, etc.
    
    return NextResponse.json(
      {
        success: true,
        message: 'Data received successfully',
        receivedData: body,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
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
          'Access-Control-Allow-Origin': '*',
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
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}

