import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface InvoiceRequest {
  orderId: string;
  phone: string;
  customerName: string;
  area: string;
  detailedAddress: string;
  items: InvoiceItem[];
  totalAmount: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { orderId, phone, customerName, area, detailedAddress, items, totalAmount }: InvoiceRequest = await req.json();

    let invoice = "\n";
    invoice += "\u202B\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557\u202C\n";
    invoice += "\u202B\u2551                                    \u2551\u202C\n";
    invoice += "\u202B\u2551         \ud83c\udf19 \u062c\u0640\u0640\u0627\u0631\u0629 \u0627\u0644\u0642\u0640\u0640\u0645\u0640\u0640\u0631 \ud83c\udf19        \u2551\u202C\n";
    invoice += "\u202B\u2551      \u062a\u0639\u0627\u0648\u0646\u064a\u0629 \u0645\u0634\u063a\u0631\u0629 \u0644\u0644\u0645\u0646\u062a\u062c\u0627\u062a \u0627\u0644\u0639\u0636\u0648\u064a\u0629     \u2551\u202C\n";
    invoice += "\u202B\u2551                                    \u2551\u202C\n";
    invoice += "\u202B\u255a\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255d\u202C\n\n";
    invoice += "\u202B\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u202C\n";
    invoice += "\u202B           \u2728 \u0641\u0627\u062a\u0648\u0631\u0629 \u0637\u0644\u0628 \u0634\u0631\u0627\u0621 \u2728          \u202C\n";
    invoice += "\u202B\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u202C\n\n";
    invoice += `\u202B\u0627\u0644\u062a\u0627\u0631\u064a\u062e: ${new Date().toLocaleString('ar-EG', { timeZone: 'Asia/Beirut' })}\u202C\n`;
    invoice += `\u202B\u0631\u0642\u0645 \u0627\u0644\u0637\u0644\u0628: #${orderId.slice(0, 8)}\u202C\n`;
    invoice += `\u202B\u0627\u0633\u0645 \u0627\u0644\u0632\u0628\u0648\u0646: ${customerName}\u202C\n`;
    invoice += `\u202B\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062a\u0641: ${phone}\u202C\n`;

    if (area && area.trim()) {
      invoice += `\u202B\u0627\u0644\u0645\u0646\u0637\u0642\u0629: ${area}\u202C\n`;
    }

    if (detailedAddress && detailedAddress.trim()) {
      invoice += `\u202B\u0627\u0644\u0639\u0646\u0648\u0627\u0646: ${detailedAddress}\u202C\n`;
    }

    invoice += "\n";
    invoice += "\u202B\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u202C\n";
    invoice += "\u202B        \ud83d\udce6 \u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a \u0627\u0644\u0645\u0634\u062a\u0631\u0627\u0629 \ud83d\udce6         \u202C\n";
    invoice += "\u202B\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u202C\n\n";

    items.forEach((item, index) => {
      invoice += `\u202B${index + 1}. ${item.name}\u202C\n`;
      invoice += `\u202B   \u2022 \u0627\u0644\u0643\u0645\u064a\u0629: ${item.quantity}\u202C\n`;
      invoice += `\u202B   \u2022 \u0627\u0644\u0633\u0639\u0631 \u0644\u0644\u0648\u062d\u062f\u0629: $${item.price.toFixed(2)}\u202C\n`;
      invoice += `\u202B   \u2022 \u0627\u0644\u0625\u062c\u0645\u0627\u0644\u064a: $${(item.quantity * item.price).toFixed(2)}\u202C\n\n`;
    });

    invoice += "\u202B\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u202C\n";
    invoice += `\u202B      \ud83d\udcb0 \u0627\u0644\u0645\u062c\u0645\u0648\u0639 \u0627\u0644\u0643\u0644\u064a: $${totalAmount.toFixed(2)} \ud83d\udcb0\u202C\n`;
    invoice += "\u202B\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u202C\n\n";
    invoice += "\u202B    \u2728 \u0634\u0643\u0631\u0627\u064b \u0644\u0627\u062e\u062a\u064a\u0627\u0631\u0643 \u062c\u0627\u0631\u0629 \u0627\u0644\u0642\u0645\u0631! \u2728    \u202C\n";
    invoice += "\u202B     \u0645\u0646\u062a\u062c\u0627\u062a \u0639\u0636\u0648\u064a\u0629 \u0637\u0628\u064a\u0639\u064a\u0629 100%      \u202C\n";
    invoice += "\u202B         \u062f\u0645\u062a\u0645 \u0628\u062e\u064a\u0631 \u0648\u0635\u062d\u0629 \ud83c\udf3f         \u202C\n\n";
    invoice += "\u202B\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u202C";

    const whatsappNumber = '9613644728';
    const whatsappMessage = encodeURIComponent(invoice);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Invoice generated successfully',
        invoice,
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