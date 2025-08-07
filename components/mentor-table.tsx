import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const mentors = [
  {
    name: "Victor Torres Singh",
    date: "25/2/2023",
    courseType: "FRONTEND",
    courseTitle: "Understanding Concept Of React",
    avatar: "/placeholder.svg?height=40&width=40"
  },
  {
    name: "Ravi Kumar",
    date: "25/2/2023",
    courseType: "FRONTEND",
    courseTitle: "Understanding Concept Of React",
    avatar: "/placeholder.svg?height=40&width=40"
  }
]

export function MentorTable() {
  return (
    <div className="bg-white rounded-lg border">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Your Mentor</h2>
          <Button variant="link" className="text-blue-600">
            See All
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs font-medium text-gray-500 uppercase">
              INSTRUCTOR NAME & DATE
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500 uppercase">
              COURSE TYPE
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500 uppercase">
              COURSE TITLE
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500 uppercase">
              ACTIONS
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mentors.map((mentor, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={mentor.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{mentor.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-gray-900">{mentor.name}</div>
                    <div className="text-sm text-gray-500">{mentor.date}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  {mentor.courseType}
                </Badge>
              </TableCell>
              <TableCell className="font-medium text-gray-900">
                {mentor.courseTitle}
              </TableCell>
              <TableCell>
                <Button variant="link" className="text-blue-600 p-0">
                  SHOW DETAILS
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
