
export const inputStyles = {
	components: {
        Input: {
          baseStyle: {
            field: {
              borderColor: "gray.400",
              border: "1px solid",
              _readOnly: {
                backgroundColor: "gray.400", 
                color: "gray.400", 
                cursor: "not-allowed", 
              },
            },
          },
          variants: {
            outline: {
              field: {
                borderColor: "gray.400",
                borderWidth: "1px",
        
                borderRadius: "5px",
                _placeholder: {
                  // color: "gray.100",
                },
                _hover: {
                  borderColor: "gray.400",
                },
              },
            },
          },
        
          defaultProps: {
            variant: "outline",
          },
        }
	}
};
