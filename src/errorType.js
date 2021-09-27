export default function explainStatusCode(code) {
  let error = "";
  if (code < 200) error += "Informational response\n";
  else if (code < 300) error += "Successful response\n";
  else if (code < 400) error += "Redirects\n";
  else if (code < 500) error += "Client error\n";
  else if (code < 600) error += "Server error\n";

  switch (code) {
    case 300:
      error += "Multiple Choice\n";
      error += "The request has more than one possible response";
      break;
    case 400:
      error += "Bad Request\n";
      error +=
        "The server could not understand the request due to invalid syntax.";
      break;
    case 401:
      error += "Unauthorized\n";
      error +=
        "Although the HTTP standard specifies 'unauthorized', semantically this response means 'unauthenticated'. That is, the client must authenticate itself to get the requested response.";
      break;
    case 402:
      error += "Payment Required\n";
      error +=
        "This response code is reserved for future use. The initial aim for creating this code was using it for digital payment systems, however this status code is used very rarely and no standard convention exists.";
      break;
    case 403:
      error += "Forbidden\n";
      error +=
        "The client does not have access rights to the content; that is, it is unauthorized, so the server is refusing to give the requested resource. Unlike 401, the client's identity is known to the server.";
      break;
    case 404:
      error += "Not Found\n";
      error +=
        "The server can not find the requested resource. In an API, this can also mean that the endpoint is valid but the resource itself does not exist. Servers may also send this response instead of 403 to hide the existence of a resource from an unauthorized client.";
      break;
    case 405:
      error += "Method Not Allowed\n";
      error +=
        "The request method is known by the server but is not supported by the target resource. For example, an API may forbid DELETE-ing a resource.";
      break;
    case 406:
      error += "Not Acceptable\n";
      error +=
        "This response is sent when the web server, after performing server-driven content negotiation, doesn't find any content that conforms to the criteria given by the user agent.";
      break;
    case 407:
      error += "Proxy Authentication Required\n";
      error +=
        "This is similar to 401 but authentication is needed to be done by a proxy.";
      break;
    case 408:
      error += "Request Timeout\n";
      error +=
        "This response is sent on an idle connection by some servers, even without any previous request by the client. It means that the server would like to shut down this unused connection. This response is used much more since some browsers, like Chrome, Firefox 27+, or IE9, use HTTP pre-connection mechanisms to speed up surfing. Also note that some servers merely shut down the connection without sending this message.";
      break;
    case 409:
      error += "Conflict\n";
      error +=
        "This response is sent when a request conflicts with the current state of the server.";
      break;
    case 410:
      error += "Gone\n";
      error +=
        "This response is sent when the requested content has been permanently deleted from server, with no forwarding address. Clients are expected to remove their caches and links to the resource.";
      break;
    case 411:
      error += "Length Required\n";
      error +=
        "Server rejected the request because the Content-Length header field is not defined and the server requires it.";
      break;
    case 415:
      error += "Unsupported Media Type\n";
      error +=
        "The media format of the requested data is not supported by the server, so the server is rejecting the request.";
      break;
    case 421:
      error += "Misdirected Request\n";
      error +=
        "The request was directed at a server that is not able to produce a response. This can be sent by a server that is not configured to produce responses for the combination of scheme and authority that are included in the request URI.";
      break;
    case 423:
      error += "Locked (WebDAV)\n";
      error += "The resource that is being accessed is locked.";
      break;
    case 426:
      error += "Upgrade Required\n";
      error +=
        "The server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol. The server sends an Upgrade header in a 426 response to indicate the required protocol(s).";
      break;
    case 429:
      error += "Too Many Requests\n";
      error += "The user has sent too many requests in a given amount of time";
      break;
    case 451:
      error += "Unavailable For Legal Reasons\n";
      error +=
        "The user-agent requested a resource that cannot legally be provided, such as a web page censored by a government.";
      break;
    case 500:
      error += "Internal Server Error\n";
      error +=
        "The server has encountered a situation it doesn't know how to handle.";
      break;
    case 501:
      error += "Not Implemented\n";
      error +=
        "The request method is not supported by the server and cannot be handled. The only methods that servers are required to support (and therefore that must not return this code) are GET and HEAD.";
      break;
    case 502:
      error += "Bad Gateway\n";
      error +=
        "This error response means that the server, while working as a gateway to get a response needed to handle the request, got an invalid response.";
      break;
    case 503:
      error += "Service Unavailable\n";
      error +=
        "The server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded. Note that together with this response, a user-friendly page explaining the problem should be sent. This response should be used for temporary conditions and the Retry-After: HTTP header should, if possible, contain the estimated time before the recovery of the service. The webmaster must also take care about the caching-related headers that are sent along with this response, as these temporary condition responses should usually not be cached.";
      break;
    case 504:
      error += "Gateway Timeout\n";
      error +=
        "This error response is given when the server is acting as a gateway and cannot get a response in time";
      break;
    case 505:
      error += "HTTP Version Not Supported\n";
      error +=
        "The HTTP version used in the request is not supported by the server.";
      break;
    case 506:
      error += "Variant Also Negotiates\n";
      error +=
        "The server has an internal configuration error: the chosen variant resource is configured to engage in transparent content negotiation itself, and is therefore not a proper end point in the negotiation process.";
      break;
    case 507:
      error += "Insufficient Storage (WebDAV)\n";
      error +=
        "The method could not be performed on the resource because the server is unable to store the representation needed to successfully complete the request.";
      break;
    case 508:
      error += "Loop Detected (WebDAV)\n";
      error +=
        "The server detected an infinite loop while processing the request.";
      break;
    case 511:
      error += "Network Authentication Required\n";
      error +=
        "The 511 status code indicates that the client needs to authenticate to gain network access.";
      break;
    case 510:
      error += "Not Extended\n";
      error +=
        "Further extensions to the request are required for the server to fulfill it.";
      break;
  }

  return error;
}
