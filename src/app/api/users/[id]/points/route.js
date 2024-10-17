// app/api/users/[id]/points/route.js
import pool from "../../../../lib/db";

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const { rows } = await pool.query('SELECT points FROM users WHERE id = $1', [id]);
    if (rows.length > 0) {
      return new Response(JSON.stringify({ points: rows[0].points }), {
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
