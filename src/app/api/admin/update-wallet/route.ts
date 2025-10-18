import { NextRequest, NextResponse } from 'next/server';
import { BaseUrl } from '@/app/components/Baseurl';

export async function POST(request: NextRequest) {
  try {
    const { amount, traderId } = await request.json();

    // Validate required fields
    if (!amount || !traderId) {
      return NextResponse.json(
        { success: false, message: 'المبلغ ومعرف التاجر مطلوبان' },
        { status: 400 }
      );
    }

    // Validate amount is a number
    if (isNaN(amount) || amount < 0) {
      return NextResponse.json(
        { success: false, message: 'المبلغ يجب أن يكون رقم صحيح أكبر من أو يساوي صفر' },
        { status: 400 }
      );
    }

    // Make API call to backend
    const response = await fetch(`${BaseUrl}admin/update-wallet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: parseFloat(amount),
        traderId: traderId
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'حدث خطأ أثناء تحديث المحفظة' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'تم تحديث المحفظة بنجاح',
      data: data.data
    });

  } catch (error) {
    console.error('Error updating wallet:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}
