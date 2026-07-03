export default async function handler(req, res) {
  try {
    const r = await fetch('https://gisenyi-api.onrender.com/health');
    const data = await r.json();
    res.status(200).json({ ok: true, backend: data });
  } catch (e) {
    res.status(200).json({ ok: false, error: e.message });
  }
}

export const config = {
  maxDuration: 30,
};
