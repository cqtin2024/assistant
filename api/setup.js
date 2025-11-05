export default async function handler(req, res) {
  try {
    const { action } = req.body;

    if (action === 'test_github') {
      const { token, repo } = req.body;
      const gh = await fetch(`https://api.github.com/repos/${repo}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (gh.status === 404) {
        // Tạo repo mới nếu chưa có
        const create = await fetch(`https://api.github.com/user/repos`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: repo.split('/')[1], private: false }),
        });
        if (create.ok) {
          return res.status(200).send(`✅ Repo mới "${repo}" đã được tạo.`);
        } else {
          const err = await create.json();
          return res.status(400).send(`❌ Lỗi tạo repo: ${err.message}`);
        }
      }

      if (gh.ok) return res.status(200).send('✅ Kết nối GitHub thành công!');
      else return res.status(400).send('❌ Token hoặc repo không hợp lệ.');
    }

    if (action === 'deploy') {
      // Giai đoạn này sẽ: commit file mẫu + gọi API Vercel (tùy chọn)
      return res.status(200).send('🚀 Deploy handler đang được phát triển.');
    }

    res.status(400).send('❌ Action không hợp lệ.');
  } catch (err) {
    res.status(500).send('❌ Lỗi server: ' + err.message);
  }
}
