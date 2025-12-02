import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ConfirmationRequest {
  phone: string;
  customerName: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { phone, customerName }: ConfirmationRequest = await req.json();

    const message = `تم تأكيد طلبك والبضاعة في طريقها اليك\n\nشكراً لكم على ثقتكم بمنتوجاتنا\n\n*منتوجات قلب القمر*`;

    const whatsappMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phone}?text=${whatsappMessage}`;

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Confirmation message generated successfully',
        whatsappUrl,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});