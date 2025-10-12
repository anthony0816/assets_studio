const NotificationsStatesIcon = ({ type, size = 20 }) => {
  const iconProps = {
    width: size,
    height: size,
    fill: "currentColor",
    viewBox: "0 0 20 20",
  };

  switch (type) {
    case "like":
      return (
        <svg {...iconProps}>
          <path
            fillRule="evenodd"
            d="M2 21h4V9H2v12zm20.5-10.5c0-.83-.67-1.5-1.5-1.5h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 2 7.59 8.59C7.22 8.95 7 9.45 7 10v9c0 .83.67 1.5 1.5 1.5h9.75c.62 0 1.16-.38 1.38-.91l2.26-5.29c.07-.17.11-.36.11-.55v-3.25z"
            clipRule="evenodd"
          />
        </svg>
      );

    case "dislike":
      return (
        <svg {...iconProps}>
          <path
            fillRule="evenodd"
            d="M22 3h-4v12h4V3zM2.5 13.5c0 .83.67 1.5 1.5 1.5h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 22l6.59-6.59c.37-.36.59-.86.59-1.41V5c0-.83-.67-1.5-1.5-1.5H5.76c-.62 0-1.16.38-1.38.91L2.12 9.71c-.07.17-.12.36-.12.55v3.24z"
            clipRule="evenodd"
          />
        </svg>
      );

    case "coment":
      return (
        <svg {...iconProps}>
          <path
            fillRule="evenodd"
            d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
            clipRule="evenodd"
          />
        </svg>
      );

    default:
      return (
        <svg {...iconProps}>
          <path
            fillRule="evenodd"
            d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"
            clipRule="evenodd"
          />
        </svg>
      );
  }
};

export default NotificationsStatesIcon;
