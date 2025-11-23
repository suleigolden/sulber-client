
export const modalStyles = {
	components: {
		Modal: {
      baseStyle: {
        overlay: {
          backdropFilter: "blur(20px) hue-rotate(20deg)",
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          padding:"90px"
        },
        header: {
          fontFamily: "var(--chakra-fonts-heading)",
          fontWeight: "normal",
          color: "#000",
          padding: "1rem 2.6rem",
          fontSize: "25px",
          marginTop: 7,
        },
        body: {
          fontSize: "1rem",
          padding: "1rem 2.6rem",
          color: "#68738B",
        },
        footer: {
          padding: "2rem 2.6rem",
        },
        dialog: {
          borderRadius: "2xl",
        },
      },
      defaultProps: {
        motionPreset: "slideInBottom",
      },
		}
	}
};

