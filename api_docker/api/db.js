import conn from "./connection.js";

export async function getAllBlogs() {
  try {
    const [rows] = await conn.query("SELECT * FROM blog_posts");
    return rows;
  } catch (e) {
    console.log(e);
    return e;
  }
}

export async function getBlogById(id) {
  try {
    const [rows] = await conn.query(
      `SELECT * FROM blog_posts WHERE id = ${id}`
    );
    return rows[0];
  } catch (e) {
    console.log(e);
    return e;
  }
}

export async function createBlog(title, content, banner) {
  try {
    const [result] = await conn.query(
      "INSERT INTO blog_posts (title, content, banner) VALUES (?, ?, ?)",
      [title, content, banner]
    );

    const insertedId = result.insertId;

    const [newBlog] = await conn.query(
      "SELECT * FROM blog_posts WHERE id = ?",
      [insertedId]
    );

    return newBlog[0];
  } catch (e) {
    console.log(e);
    return e;
  }
}

export async function updateBlog(id, title, content, banner) {
  try {
    await conn.query(
      `UPDATE blog_posts SET title='${title}', content='${content}', banner='${banner}' WHERE id=${id}`
    );
    const [updatedRows] = await conn.query(
      `SELECT * FROM blog_posts WHERE id = ${id}`
    );
    return updatedRows[0];
  } catch (e) {
    console.log(e);
    return e;
  }
}

export async function deleteBlog(id) {
  try {
    const [result] = await conn.query(
      `DELETE FROM blog_posts WHERE id = ${id}`
    );
    return result;
  } catch (e) {
    console.log(e);
    return e;
  }
}
