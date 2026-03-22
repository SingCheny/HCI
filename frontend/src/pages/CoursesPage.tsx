import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, Clock, ChevronRight, Star } from 'lucide-react';
import api from '../services/api';
import { useI18n } from '../i18n';
import type { Course } from '../types';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useI18n();

  useEffect(() => {
    api.get('/courses').then((r) => {
      setCourses(r.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full spinner" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">{t('coursesTitle')}</h1>
        <p className="text-gray-400 mt-1">{t('coursesSubtitle')}</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        {courses.map((course, idx) => {
          const done = course.lessons.filter((l) => l.completed).length;
          const total = course.lessons.length;
          const pct = total > 0 ? (done / total) * 100 : 0;
          const allDone = done === total && total > 0;

          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="glass rounded-2xl overflow-hidden card-hover"
            >
              {/* Color top bar */}
              <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${course.color}, ${course.color}88)` }} />
              
              <div className="p-7">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: course.color + '25' }}
                    >
                      <BookOpen className="w-6 h-6" style={{ color: course.color }} />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">{course.title}</h2>
                      <p className="text-xs text-gray-400">{total} {t('coursesLessons')}</p>
                    </div>
                  </div>
                  {allDone && (
                    <div className="flex items-center gap-1 text-green-400 text-xs font-medium bg-green-500/10 px-2 py-1 rounded-full">
                      <CheckCircle className="w-3 h-3" /> {t('coursesComplete')}
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{course.description}</p>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>{t('coursesProgress')}</span>
                    <span>{done}/{total} {t('coursesLessons')}</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: course.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {/* Lessons List */}
                <div className="space-y-3">
                  {course.lessons.map((lesson) => (
                    <Link
                      key={lesson.id}
                      to={`/lesson/${lesson.id}`}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          lesson.completed
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-white/10 text-gray-400'
                        }`}>
                          {lesson.completed ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <span className="text-xs font-medium">{lesson.order_index + 1}</span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-200 group-hover:text-white transition">{lesson.title}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{lesson.estimated_minutes} {t('coursesMin')}</span>
                            <Star className="w-3 h-3" />
                            <span>{lesson.xp_reward} XP</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-primary-400 transition" />
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
