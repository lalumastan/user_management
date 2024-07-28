package icsdiscover.service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import icsdiscover.model.Users;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.io.Encoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
	@Value("${spring.datasource.username}")
	public String SPRING_DATASOURCE_USERNAME;
	
	@Value("${spring.datasource.password}")
	public String SPRING_DATASOURCE_PASSWORD;
	
    @Value("${spring.datasource.url}")
    public String SPRING_DATASOURCE_URL;	
	
    @Value("${security.jwt.token.validity}")
    public long TOKEN_VALIDITY;

    //@Value("${security.jwt.signing.key}")
    public String SIGNING_KEY;

    @Value("${security.jwt.authorities.key}")
    public String AUTHORITIES_KEY;

    public String generateToken (Users users) {
    	final Map<String, Object> extraClaims = new HashMap<>();                
    	
        extraClaims.put(AUTHORITIES_KEY, users.getAuthorities());
        
        return Jwts
                .builder()
                .claims().empty().add(extraClaims).and()
                .subject(users.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + TOKEN_VALIDITY))
                .signWith(getSignInKey())
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
    
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSignInKey() {
    	String SIGNING_KEY = Encoders.BASE64.encode((SPRING_DATASOURCE_USERNAME + SPRING_DATASOURCE_PASSWORD + SPRING_DATASOURCE_URL).getBytes());
    	
        byte[] keyBytes = Decoders.BASE64.decode(SIGNING_KEY);
        
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
