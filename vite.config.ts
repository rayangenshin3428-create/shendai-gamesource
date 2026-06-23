import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vite.dev/config/
export default defineConfig({
  // Chemins RELATIFS : indispensable pour que le build s'ouvre en double-clic
  // (protocole file://), sans serveur. viteSingleFile inline tout le JS + CSS
  // dans un index.html unique → « le fichier contient tout le jeu ».
  base: './',
  plugins: [react(), tailwindcss(), viteSingleFile()],
})
