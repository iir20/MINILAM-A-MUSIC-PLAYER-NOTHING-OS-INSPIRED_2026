package com.minilam.os

import android.content.Context
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.layout.Alignment
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.GlanceTheme
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.provideContent
import androidx.glance.layout.*
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import androidx.glance.unit.ColorProvider
import androidx.glance.background

class CassetteWidget : GlanceAppWidget() {
    override suspend fun provideGlance(context: Context, id: GlanceId) {
        provideContent {
            GlanceTheme {
                Column(
                    modifier = GlanceModifier
                        .fillMaxSize()
                        .background(Color.Black)
                        .padding(8.dp)
                ) {
                    // Top Info
                    Row(modifier = GlanceModifier.fillMaxWidth().padding(bottom = 6.dp)) {
                        Text(
                            text = "ANALOG_TAPE_B",
                            style = TextStyle(color = ColorProvider(Color.White.copy(alpha = 0.5f)), fontSize = 7.sp, fontWeight = FontWeight.Bold)
                        )
                        Spacer(modifier = GlanceModifier.defaultWeight())
                        Text(
                            text = "NR_OFF",
                            style = TextStyle(color = ColorProvider(Color.White.copy(alpha = 0.3f)), fontSize = 7.sp)
                        )
                    }

                    // Outer Shell
                    Box(
                        modifier = GlanceModifier
                            .fillMaxWidth()
                            .height(100.dp)
                            .background(Color.DarkGray.copy(alpha = 0.3f))
                            .padding(6.dp)
                    ) {
                        Column(modifier = GlanceModifier.fillMaxSize()) {
                            // Reels Area with dot matrix texture
                            Row(
                                modifier = GlanceModifier
                                    .fillMaxWidth()
                                    .height(50.dp)
                                    .background(Color.Black)
                                    .padding(horizontal = 12.dp),
                                verticalAlignment = Alignment.Vertical.CenterVertically,
                                horizontalAlignment = Alignment.Horizontal.CenterHorizontally
                            ) {
                                Reel()
                                Spacer(modifier = GlanceModifier.defaultWeight())
                                Reel()
                            }

                            Spacer(modifier = GlanceModifier.height(8.dp))

                            // Premium Label
                            Box(
                                modifier = GlanceModifier
                                    .fillMaxWidth()
                                    .height(24.dp)
                                    .background(Color(0xFFFF3B30))
                                    .padding(horizontal = 8.dp, vertical = 2.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Row(verticalAlignment = Alignment.Vertical.CenterVertically) {
                                    Text(
                                        text = "MINILAM_TAPE_II",
                                        style = TextStyle(color = ColorProvider(Color.Black), fontSize = 8.sp, fontWeight = FontWeight.Bold)
                                    )
                                    Spacer(modifier = GlanceModifier.defaultWeight())
                                    Text(
                                        text = "90 MIN",
                                        style = TextStyle(color = ColorProvider(Color.Black), fontSize = 7.sp)
                                    )
                                }
                            }
                        }
                    }

                    Spacer(modifier = GlanceModifier.height(8.dp))
                    
                    Row(verticalAlignment = Alignment.Vertical.CenterVertically) {
                        Box(modifier = GlanceModifier.size(4.dp).background(Color(0xFFFF3B30))) {}
                        Spacer(modifier = GlanceModifier.width(6.dp))
                        Text(
                            text = "PLAYING: 12:45 / 45:00",
                            style = TextStyle(color = ColorProvider(Color.White), fontSize = 8.sp, fontWeight = FontWeight.Medium)
                        )
                    }
                }
            }
        }
    }

    @Composable
    private fun Reel() {
        Box(
            modifier = GlanceModifier
                .size(24.dp)
                .background(Color.White.copy(alpha = 0.1f)),
            contentAlignment = Alignment.Center
        ) {
            Box(
                modifier = GlanceModifier
                    .size(6.dp)
                    .background(Color.White)
            ) {}
        }
    }
}
