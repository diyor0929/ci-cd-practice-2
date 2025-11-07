from django.test import TestCase

# Create your tests here.
from .models import Task


class TaskModelTest(TestCase):
    def test_create_task(self):
        """Ensure a  Task can be created and saved."""
        task = Task.objects.create(title="Write CI/CD tests")
        self.assertEqual(task.title, "Write CI/CD tests")
