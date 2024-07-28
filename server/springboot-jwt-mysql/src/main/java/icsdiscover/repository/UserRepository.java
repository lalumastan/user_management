package icsdiscover.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import icsdiscover.model.Users;

@Repository
public interface UserRepository extends JpaRepository<Users, String> {
	@Query("SELECT u FROM Users u WHERE u._id = :_id")
	Users findUserById(@Param("_id") Integer _id);
}
