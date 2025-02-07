/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
      return [
        {
          source: "/api/:path*", // API'ye gelen tüm istekleri hedef alır
          headers: [
            {
              key: "Access-Control-Allow-Origin",
              value: "*" // Herhangi bir origin'e izin verir (geliştirme için yaygın, üretimde daha güvenli bir yaklaşım kullanabilirsiniz)
            },
            {
              key: "Access-Control-Allow-Methods",
              value: "GET, POST, PUT, DELETE, OPTIONS"
            },
            {
              key: "Access-Control-Allow-Headers",
              value: "Content-Type, Authorization"
            }
          ]
        }
      ];
    }
  };
  
  export default nextConfig;
  