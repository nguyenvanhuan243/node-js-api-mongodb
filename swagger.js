import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node API',
      description: "API endpoints for a node server documented on swagger",
      contact: {
        name: "Huan Nguyen",
        email: "nguyenvanhuan243@gmail.com",
        url: "https://github.com/nguyenvanhuan243"
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