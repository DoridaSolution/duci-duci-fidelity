// app/api/users/[id]/points/add/route.js
import pool from "../../../../../lib/db";

export async function POST(request, { params }) {
  const { id } = params;
  const { points } = await request.json(); // Punti inviati dal client

  try {
    const result = await pool.query('UPDATE users SET points = points + $1 WHERE id = $2 RETURNING points', [points, id]);
    if (result.rowCount > 0) {
      return new Response(JSON.stringify({ points: result.rows[0].points }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ message: 'User not found' }), {
        status: 404,
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Database error' }), {
      status: 500,
    });
  }
}
