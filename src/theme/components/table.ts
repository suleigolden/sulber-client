export const tableStyles = {
	components: {
        Table: {
            variants: {
              brand: {
                table: {
                  borderCollapse: 'separate',
                  borderSpacing: '0',
                },
                th: {
                  bg: '#F00',
                  color: 'white',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                },
                td: {
                  borderBottom: '1px solid',
                  borderColor: 'blackAlpha.200',
                },
                tbody: {
                  tr: {
                    _odd: {
                      bg: '#F00',
                    },
                    _even: {
                      bg: 'blackAlpha.100',
                    },
                  },
                },
              },
            },
            defaultProps: {
              variant: "brand", 
            },
          },
	}
};
