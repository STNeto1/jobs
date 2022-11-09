import { SimpleGrid, Skeleton } from '@chakra-ui/react'
import { trpc } from '../utils/trpc'
import JobCard from './JobCard'

const jobs: Array<{ id: string }> = Array.from({ length: 3 }, (_, i) => ({
  id: `job-${i}`
}))

const LatestJobs: React.FC = () => {
  const { data, isLoading } = trpc.job.latestJobs.useQuery({
    limit: 3
  })

  return (
    <Skeleton
      height={'xl'}
      width={'full'}
      color={'white'}
      isLoaded={!isLoading}
    >
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
        {data?.map((job) => (
          <JobCard
            key={job.id}
            company={job.company.name}
            location={job.location}
            size={job.company.size}
            remote={job.remote}
            title={job.title}
          />
        ))}
      </SimpleGrid>
    </Skeleton>
  )
}

export default LatestJobs
