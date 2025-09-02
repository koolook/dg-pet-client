# About

This is my personal study for Next.js + React frameworks.
It's a blog-like application. A user can create, update and delete rich text articles with cover picture and attachments capability.
You can find the client side of this project in https://github.com/koolook/dg-pet-server

## Key components I used

- Next.js + React - base framework
- Axios - http client
- react-quill(-new) - React version of Quill rich text editor
- react-bootstrap + bootstrap - styling library

# How to run

Before you run splecify API server URL with environment variable `NEXT_PUBLIC_HOST_API`.
For the default server in sibling repository https://github.com/koolook/dg-pet-server use `http://localhost:4000`

To run application serve in Docker container use

```
> docker compose watch
```

Client wil run at 'http://localhost:3000'
