const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`
🚀 Gisenyi Professional Backend Running
📡 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
    `);
});
