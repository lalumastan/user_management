package icsdiscover.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import icsdiscover.model.Users;

public interface UserRepository extends MongoRepository<Users, Integer> {	
    @Query("{username:'?0'}")
	Users findUserByUsername(String username);
}
