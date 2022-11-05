import { Button, Flex, IconButton, Text } from '@chakra-ui/react'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons'

// https://www.zacfukuda.com/blog/pagination-algorithm
const paginate = (current: number, max: number) => {
  if (!current || !max) return null

  const prev = current === 1 ? null : current - 1
  const next = current === max ? null : current + 1
  const items: Array<string | number> = [1]

  if (current === 1 && max === 1) return { current, prev, next, items }
  if (current > 4) items.push('…')

  const r = 2
  const r1 = current - r
  const r2 = current + r + 1

  for (let i = r1 > 2 ? r1 : 2; i <= Math.min(max, r2); i++) items.push(i)

  if (r2 + 1 < max) items.push('…')
  if (r2 < max) items.push(max)

  return { current, prev, next, items }
}

type Props = {
  page: number
  count: number
  onClick: (page: number) => void
}

const Pagination: React.FC<Props> = ({ count, page, onClick }) => {
  const items = paginate(page, count)

  return (
    <Flex gap={2}>
      <IconButton
        aria-label="go back"
        size={'sm'}
        icon={<IconChevronLeft width={20} height={20} />}
        onClick={() => onClick(page - 1)}
        disabled={page === 1}
      />

      {items?.items.map((item) => {
        if (typeof item === 'string') {
          return <Text key={Math.random().toString()}>{item}</Text>
        }

        return (
          <Button
            size={'sm'}
            key={`pagination-item-${item}`}
            onClick={() => onClick(item)}
          >
            {item}
          </Button>
        )
      })}

      <IconButton
        aria-label="go forward"
        size={'sm'}
        icon={<IconChevronRight width={20} height={20} />}
        onClick={() => onClick(page + 1)}
        disabled={page === count}
      />
    </Flex>
  )
}

export default Pagination
