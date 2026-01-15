export const prerender = true;

export function GET() {
    return new Response(JSON.stringify({ msg: 'Keystatic API not available in static mode' }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

export function POST() {
    return new Response(JSON.stringify({ msg: 'Keystatic API not available in static mode' }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

export function ALL() {
    return new Response(JSON.stringify({ msg: 'Keystatic API not available in static mode' }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

export function getStaticPaths() {
    return [
        { params: { params: undefined } },
    ];
}
