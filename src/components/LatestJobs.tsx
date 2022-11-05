import { SimpleGrid } from '@chakra-ui/react'
import JobCard from './JobCard'

const jobs: Array<{ id: string }> = Array.from({ length: 3 }, (_, i) => ({
  id: `job-${i}`
}))

const LatestJobs: React.FC = () => {
  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
      {jobs.map((job) => (
        <JobCard key={job.id} />
      ))}
    </SimpleGrid>
  )
}

export default LatestJobs
