import sanityClient from '@sanity/client'

/*
Change with your sanity client credentials or other storage provider 
*/
export const client = sanityClient({
    projectId: 'wapu95qe',
    dataset: 'production',
    apiVersion: '2021-03-25',
    token: 'sk8IwHgt16G3aIfvJwRY4Ve0pDasASEk0MSCn3F5zdKFSOzzmmGXLH9RmBU9ZEjYzNdOFwCNyfpXTntYGTKelDczv9O1BE1yrofEzp7UVF3Lk6BhP9fmoapYYXd01XjCVYIjWx7NNe4VYTaaf900wGtXaPTgaXcraIW77QLo2iVXmujSvP5A',
    useCdn: false,
})