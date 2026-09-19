package com.constructiq.repository;

import com.constructiq.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    @Query("SELECT p FROM Project p WHERE p.id IN (SELECT pa.project.id FROM ProjectAssignment pa WHERE pa.user.id = :userId)")
    List<Project> findAssignedProjectsByUserId(@Param("userId") Long userId);

}
