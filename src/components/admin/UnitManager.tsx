
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, FileText, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Unit {
  id: string;
  name: string;
  description: string;
  course_id: number;
  order_index: number;
  xp_reward: number;
  created_at: string;
}

interface Course {
  id: string;
  name: string;
}

export function UnitManager() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    course_id: '',
    order_index: '',
    xp_reward: '50'
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCoursesAndUnits();
  }, []);

  const fetchCoursesAndUnits = async () => {
    try {
      // First fetch courses
      const coursesResponse = await fetch('https://languagelearningdep.onrender.com/api/courses');
      if (!coursesResponse.ok) throw new Error('Failed to fetch courses');
      const coursesData = await coursesResponse.json();
      setCourses(coursesData);

      // Then fetch all units from all courses
      const allUnits: Unit[] = [];
      for (const course of coursesData) {
        try {
          const unitsResponse = await fetch(`https://languagelearningdep.onrender.com/api/courses/${course.id}/units`);
          if (unitsResponse.ok) {
            const courseUnits = await unitsResponse.json();
            // Flatten the units from the nested structure
            courseUnits.forEach((unit: any) => {
              allUnits.push({
                id: unit.id,
                name: unit.name,
                description: unit.description,
                course_id: parseInt(course.id),
                order_index: unit.order_index,
                xp_reward: unit.xp_reward,
                created_at: unit.created_at
              });
            });
          }
        } catch (error) {
          console.log(`No units found for course ${course.id}`);
        }
      }
      
      setUnits(allUnits);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch units and courses. Make sure the backend server is running.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const response = await fetch('https://languagelearningdep.onrender.com/api/units', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          course_id: parseInt(formData.course_id),
          order_index: parseInt(formData.order_index) || 0,
          xp_reward: parseInt(formData.xp_reward) || 50
        }),
      });

      if (!response.ok) throw new Error('Failed to add unit');

      toast({
        title: "Success!",
        description: "Unit added successfully",
      });

      setFormData({ name: '', description: '', course_id: '', order_index: '', xp_reward: '50' });
      setShowForm(false);
      fetchCoursesAndUnits();
    } catch (error) {
      console.error('Error adding unit:', error);
      toast({
        title: "Error",
        description: "Failed to add unit",
        variant: "destructive",
      });
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Unit Management ({units.length} units)
            </CardTitle>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Unit
          </Button>
        </CardHeader>
        <CardContent>
          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 border rounded-lg bg-gray-50">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Unit Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Basic Greetings"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Course</label>
                  <select
                    value={formData.course_id}
                    onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Unit description..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Order Index</label>
                  <Input
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData({ ...formData, order_index: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">XP Reward</label>
                  <Input
                    type="number"
                    value={formData.xp_reward}
                    onChange={(e) => setFormData({ ...formData, xp_reward: e.target.value })}
                    placeholder="50"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={adding}>
                  {adding ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                  Add Unit
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {units.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Course ID</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>XP</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {units.map((unit) => (
                  <TableRow key={unit.id}>
                    <TableCell className="font-medium">{unit.name}</TableCell>
                    <TableCell>{unit.description}</TableCell>
                    <TableCell>{unit.course_id}</TableCell>
                    <TableCell>{unit.order_index}</TableCell>
                    <TableCell>{unit.xp_reward}</TableCell>
                    <TableCell>{new Date(unit.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No units found. Add your first unit above.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
