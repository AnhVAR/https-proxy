const express = require("express");
const http = require("http");
const { createProxyServer } = require("http-proxy");

const app = express();
const proxy = createProxyServer({
  target: "http://42.119.180.122:84", // địa chỉ gốc (PixelStreaming server)
  changeOrigin: true,
  ws: true
});

// proxy HTTP
app.use((req, res) => {
  proxy.web(req, res, {}, (error) => {
    console.error("Proxy HTTP error:", error.message);
    res.status(500).send("Proxy HTTP error");
  });
});

// tạo server HTTP hỗ trợ WebSocket
const server = http.createServer(app);

// proxy WebSocket
server.on("upgrade", (req, socket, head) => {
  proxy.ws(req, socket, head, {}, (error) => {
    console.error("Proxy WS error:", error.message);
    socket.destroy();
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Proxy server đang chạy tại cổng ${PORT}`);
});