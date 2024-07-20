import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mini Blog API',
      description: "API endpoints for a mini blog services documented on swagger",
      contact: {
        name: "Desmond Obisi",
        email: "info@miniblog.com",
        url: "https://github.com/DesmondSanctity/node-js-swagger"
      },
      version: '1.0.0',
    },
    servers: [
      {
        url: "http://localhost:3000/",
        description: "Local server"
      },
      {
        url: "<your live url here>",
        description: "Live server"
      },
    ]
  },
  // looks for configuration in specified directories
  apis: ['./router/*.js'],
}
const swaggerSpec = swaggerJsdoc(options)
function swaggerDocs(app, port) {
  // Swagger Page
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  // Documentation in JSON format
  app.get('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })
}
export default swaggerDocs