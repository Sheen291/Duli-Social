package com.duli.duli_social.config;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.security.core.Authentication;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

public class JwtProvider {
    private static SecretKey key=Keys.hmacShaKeyFor(JwtConstant.SECRET_KEY.getBytes());

    //phương thức tạo token sau khi người dùng đăng nhập thành công, auth chứa thông tin xác thực người dùng; trả về chuỗi jwt token
    public static String generateToken(Authentication auth) {
        String jwt = Jwts.builder()
                        .setIssuer("duonguyen").setIssuedAt(new Date())
                        .setExpiration(new Date(new Date().getTime()+86400000)) //ghi tên, thời điểm tạo token và đặt hạn sử dụng: 24h
                        .claim("email", auth.getName()) //thêm thông tin email của người dùng vào token
                        .signWith(key)  //ký token bằng khóa bí mật key
                        .compact();     //nén thông tin đã tạo thành chuỗi ký tự dài: jwt token
        
        return jwt;
    }

    //phương thức xác thực một jwt token gửi từ client và lấy email người dùng từ đó, trả về email người dùng nếu hợp lệ
    public static String getEmailFromJwtToken(String jwt) {
        
        jwt=jwt.substring(7);   //token thường có dạng Bearer .... nên phải cắt 7 ký tự đầu

        Claims claims=Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()   //kiểm tra bằng key
                    .parseClaimsJws(jwt)
                    .getBody();
        
        String email=String.valueOf(claims.get("email"));   //lấy ra thông tin email trong token

        return email;
    }
}
